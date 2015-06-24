#!/usr/bin/env python3
import flask
import flask.views
import wtforms
import wtforms_json
import lager
import tinydb
import thermostat
import werkzeug

app = flask.Flask(__name__, static_folder='../../build')
global ike

class BeerForm(wtforms.Form):
    name = wtforms.StringField('name', [wtforms.validators.Length(max=64),
                                        wtforms.validators.DataRequired()])
    description = wtforms.StringField('description', [wtforms.validators.Length(max=1024),
                                                      wtforms.validators.DataRequired()])
    brewedBy = wtforms.StringField('brewedBy', [wtforms.validators.Length(max=64),
                                                wtforms.validators.DataRequired()])
    style = wtforms.StringField('style', [wtforms.validators.Length(max=64),
                                          wtforms.validators.DataRequired()])
    abv = wtforms.FloatField('abv', [wtforms.validators.NumberRange(min=0, max=100)])
    rating = wtforms.FloatField('rating', [wtforms.validators.NumberRange(min=0, max=100)])
    ibu = wtforms.FloatField('ibu', [wtforms.validators.NumberRange(min=0, max=300)])
    srm = wtforms.FloatField('srm', [wtforms.validators.NumberRange(min=0, max=100)])
    costPerPint = wtforms.FloatField('costPerPint')
    #TODO: date on tap
    #TODO finished
    #TODO: list of ratings?


class UserForm(wtforms.Form):
    name = wtforms.StringField('name', [wtforms.validators.Length(max=25),
                                 wtforms.validators.DataRequired()])
    email = wtforms.StringField('email', [wtforms.validators.Email()])
    rfidId = wtforms.StringField('rfidId', [wtforms.validators.Length(max=35)])
    nfcId = wtforms.StringField('nfcId', [wtforms.validators.Length(max=35)])
    untappedName = wtforms.StringField('untappedName', [wtforms.validators.Length(max=35)])
    #TODO: list of pour ids?


class KegForm(wtforms.Form):
    beerId = wtforms.IntegerField('beerId', [wtforms.validators.DataRequired()])
    litersRemaining = wtforms.FloatField('litersRemaining', [])
    litersCapacity = wtforms.FloatField('litersCapacity', [wtforms.validators.DataRequired()])
    #TODO: validate litersRemaining < litersCapacity


class KegeratorForm(wtforms.Form):
    name = wtforms.StringField('name', [wtforms.validators.Length(max=64)])
    kegIds = wtforms.IntegerField('kegIds', [])
    termostat_set_temp_c = wtforms.FloatField('thermostat.setTempC', [wtforms.validators.NumberRange(min=-20, max=50)])


class ResourceApi(flask.views.MethodView):
    def __init__(self, dbPath, resource_name, form_validator):
        super(ResourceApi, self).__init__()
        self.db = tinydb.TinyDB(dbPath)
        self.resource_name = resource_name
        self.form_validator = form_validator

    def get(self, id):
        if id is None:
            # return a list of all resources
            match = self.db.all()
        else:
            # expose a single resource
            match = self.db.get(eid=id)
            if match is None:
                raise werkzeug.exceptions.NotFound()
        return flask.jsonify({'data': match})

    def post(self):
        # create a new resource
        form = self.form_validator.from_json(flask.request.get_json())
        if form.validate():
            ret = flask.jsonify({'id':self.db.insert(form.data)})
        else:
            print(form.errors)
            raise werkzeug.exceptions.BadRequest(flask.jsonify(form.errors))
        return ret

    def delete(self, id):
        # delete a single resource
        try:
            self.db.remove(eids=[id])
            return flask.jsonify({'status': 'OK'})
        except KeyError:
            raise werkzeug.exceptions.NotFound()

    def put(self, id):
        # update a single resource
        value = self.db.get(eid=id)
        value.update(flask.request.get_json())
        form = self.form_validator.from_json(value)
        if form.validate():
            self.db.update(form.data, eids=[id])
            return flask.jsonify(self.db.get(eid=id))
        else:
            raise werkzeug.exceptions.BadRequest(flask.jsonify(form.errors))


class BeerApi(ResourceApi):
    def __init__(self):
        super(BeerApi, self).__init__('beers.json', 'beers', BeerForm)


class UserApi(ResourceApi):
    def __init__(self):
        super(UserApi, self).__init__('users.json', 'users', UserForm)


class KegApi(flask.views.MethodView):
    def get(self, id):
        if id is None:
            ret = {'data':[]}
            for k in ike.kegs:
                ret['data'].append(k.get_state())
        else:
            if id<len(ike.kegs):
                ret = {'data': ike.kegs[id].get_state()}
            else:
                raise werkzeug.exceptions.NotFound({'error' : '{} is not a valid keg id'.format(id)})
        return flask.jsonify(ret)

    def put(self, id):
        if id<len(ike.kegs):
            value = ike.kegs[id].get_state().copy()
            value.update(flask.request.get_json())
            form = KegForm.from_json(value)
            if form.validate():
                ike.kegs[id].set_state(form.data)
                ret = ike.kegs[id].get_state()
            else:
                raise werkzeug.exceptions.BadRequest()
        else:
            raise werkzeug.exceptions.NotFound({'error' : '{} is not a valid keg id'.format(id)})
        return flask.jsonify(ret)


class KegeratorSettingsApi(flask.views.MethodView):
    def __init__(self):
        super(KegeratorSettingsApi, self).__init__()
        self.db = tinydb.TinyDB('kegerator.json')
        self.resource_name = "kegerator"
        self.form_validator = KegeratorForm
        if len(self.db.all()) == 0:
            initial = {'name':'Ike',
                       'thermostat.setTempC':4.0,
                       'kegIds': [0, 1]
                       }
            form = self.form_validator.from_json(initial)
            if form.validate():
                self.db.insert(form.data)
    def get(self):
        # return kegerator settings data
        return flask.jsonify(self.db.all()[0])

    def put(self):
        # update thermostat
        value = self.db.get(eid=id)
        value.update(flask.request.get_json())
        form = self.form_validator.from_json(value)
        if form.validate():
            self.db.update(form.data, eids=[id])
            updated = self.db.get(eid=id)
            #apply to thermostat
            ike.thermostat.set_state(thermostat.ThermostatState(updated['thermostat.setTempC']))
            return flask.jsonify(updated)
        else:
            return flask.jsonify(form.errors), 40


class SensorsApi(flask.views.MethodView):
    def get(self):
        # return kegerator sensor data
        latest_sensors = ike.logger.find_events(lager.Event.sensors, 'now')
        return flask.jsonify(latest_sensors)


class EventApi(flask.views.MethodView):
    def get(self):
        types = flask.request.args.get('types')
        start = flask.request.args.get('startTime')
        end = flask.request.args.get('endTime')
        # return matching event data
        events = ike.logger.find_events(types, start, end)
        return flask.jsonify({'data':events})

def register_api(view, endpoint, url, pk='id', pk_type='int'):
    view_func = view.as_view(endpoint)
    app.add_url_rule(url, defaults={pk: None},
                     view_func=view_func, methods=['GET',])
    app.add_url_rule(url, view_func=view_func, methods=['POST',])
    app.add_url_rule('%s<%s:%s>' % (url, pk_type, pk), view_func=view_func,
                     methods=['GET', 'PUT', 'DELETE'])

def root():
    return app.send_static_file('index.html')

def send_static(path):
    return app.send_static_file(path)

def launch(ikeInstance):
    global ike
    ike = ikeInstance;
    wtforms_json.init()
    register_api(BeerApi, 'beers', '/beers/', pk='id')
    register_api(UserApi, 'users', '/users/', pk='id')

    view_func = KegApi.as_view('kegs')
    app.add_url_rule('/kegs/', defaults={'id': None}, view_func=view_func, methods=['GET',])
    app.add_url_rule('%s<%s:%s>' % ('/kegs/', 'int', 'id'), view_func=view_func, methods=['GET', 'PUT'])

    app.add_url_rule('/sensors/', view_func=SensorsApi.as_view('sensors'), methods=['GET'])
    app.add_url_rule('/kegerator/', view_func=KegeratorSettingsApi.as_view('kegerator'), methods=['GET','PUT'])
    app.add_url_rule('/events/', view_func=EventApi.as_view('events'), methods=['GET'])
    app.add_url_rule('/<path:path>', 'send_static', send_static)
    app.add_url_rule('/', 'root', root)

    app.run(host='0.0.0.0', debug=True)

class KegStub:
    def __init__(self):
        self._state={}
    def get_state(self):
        return self._state.copy()
    def set_state(self, state):
        self._state = state

def set_relay(input):
    pass

def temp_input():
    return 4.0

class IkeStub:
    def __init__(self):
        self.logger = lager.Lager('log.temp')
        self.kegs = []
        self.kegs.append(KegStub())
        self.kegs.append(KegStub())
        self.thermostat = thermostat.Thermostat(temp_input, set_relay, False, self.logger);

ike = IkeStub()
launch(ike)