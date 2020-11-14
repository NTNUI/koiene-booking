<p align="center">
<img width="200" src="ntnui/media/logo/ntnui.svg" />
</p>

# Description

The backend system for booking and administration for NTNUI Koiene.

# Installation and setup

## Dependencies

## NTNUI Membership system
This project is an add-on to ntnui-membership system and thus requires a running instance of the membership-system-backend to work.
Please see [this repository](https://github.com/NTNUI/membership-system/tree/dev/backend) for an installation guide of that system.

### Create `.env` file
If this has already been created when installing the membership-system ignore this step.
For the system to run correctly it requires a set of environment variables for the membership-backend:

```
# Django
NTNUI_SECRET_KEY= [INSERT_KEY]

# Mailgun
MAILGUN_PASSWORD=[INSERT_MAILGUNPASSWORD]
MAILGUN_API_KEY=[INSERT_API_TOKEN]

# Postgres
POSTGRES_DB=[DATABSE_NAME]
POSTGRES_USER=[DATABASE_USERNAME]
POSTGRES_PASSWORD=[DATABASE_PASSWORD]
POSTGRES_HOST=db
POSTGRES_PORT=5432
```
The `.env` file is to be placed in the root directory of the membership-system.

All the postgres variables are applied to both the database and the django application, so you are free to choose 
the parameters as you wish. 


## GNU Make
All commands require GNU make! Please install this from [here](https://www.gnu.org/software/make/), before continuing.

## Docker
It is also necessary to install [docker](https://www.docker.com/products/docker-desktop) as the back-end system runs inside docker containers.


## Installation step
Assuming there is already a running instance of [ntnui-membership-system](https://github.com/NTNUI/membership-system/tree/dev/backend), the booking and administration system can be installed in one of the following ways

### Option one, build the project and load test data
The command bellow will remove any old containers and install a clean version of the application, it will also automatically load test data. 

```
make dev-clean-install
```

The test data also comes with a test user for logging in to the admin panel, with the following information

```
Email/Username: sprint@ntnui.no
Password: SprintIsTheBest
```

### Option two, build and start the project
The command bellow will update the current build, and start the project without loading test data.
```
make start
```

## Start the project
The easies way to get the project up and running is using the command
```
make start
```

To shutdown the program use
```
Ctrl + C
```

## Issues

### django_ntnui can't find file
If you are running windows you might get an error telling you that django_ntnui cant find a file, in that case:
1. Enter the config directory
2. For each file with the .sh extension, run dos2unix filname.sh

### No data loaded
If you are unable to see koier or data loaded in the frontend application, make sure that a there is a running instance of ntnui-membership-system, and that you start an instance of the koiene-booking backed with `make dev-clean-install` after.

# File Structure

## Back-end File Structure
The entire back-end is located in the `backend` folder. In this folder you will find configuration files and the source code for the backend. The `ntnui` folder serves as the base folder for the django-project. 

Inside the django project are several apps, that each contain key functionality.
The `accounts`, `groups` and `payments` folders are inherited from the bachelor project group, while the job done for kundestyrt can be found in the `koie_booking`, and `koie_report` folders.

Integration tests are found in the `tests` folder of the `ntnui` directory.

### Quick tour of the file structure
The files found in the `views` folder defines the api-endpoint-handlers.
`urls.py` is the file where the routing from the url to the handlers are defined.
Inside `models` are the files that defines the database models. These are serialized to-and-from postgreSQL db entries and native python dictionaries. The logic for doing this and specifying which fields are wanted can be found in the `serializers` folder.

Each app follows a structured template like this:
```
┣ 📂app
┃ ┣ 📁admin (for django admin page configuration)
┃ ┣ 📁factories (for object initializing in testing)
┃ ┣ 📁migrations 
┃ ┣ 📁models (database-models)
┃ ┣ 📁serializers (serializing to and from db)
┃ ┣ 📁tests (unit tests)
┃ ┣ 📁utils (various useful stuff)
┃ ┣ 📁views (api endpoint handlers)
┃ ┣ 📜apps.py
┃ ┣ 📜urls.py (url routing)

```

## Contributing
To contribute to this project, please contact NTNUI Sprint for questions, as they will do the further development of this repository. The repository and internal documentation is private, so you will need to be a member of the NTNUI organization and recieve special permissions to develop on this repository. Note that [`membership-system`](https://github.com/NTNUI/membership-system) is a dependency of this project, so permission to this is also necessary.

Please make sure that any commited code is covered by unit tests and integration tests. This can be checked running the command 

```bash
make pytest
```

Code should also be passed through formatting with [black](https://black.readthedocs.io/en/stable/), a lint check by [flake8](https://flake8.pycqa.org/en/latest/) and import sorting by [isort](https://pycqa.github.io/isort/). To do this run
```bash
make format
```

### Pull Request Process
To contribute please create a pull request for review, and get the some reviewers to look at it. It should be approved by at least two reviewers before commiting.

When writing commit-messages please follow the conventions of [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).


## Implementing features
NTNUI Sprint keeps their backlog of features on a service called [ClickUp](https://app.clickup.com) (requires invite). Please head over there to see the status of features in the backlog.

Implementing a feature in the back-end usually consists of creating a new endpoint. This is done by creating a url config, a viewset, a serializer(optional), a model(optional), unit tests and integration tests of the endpoint.

## Examples of implementing new features in the backend

### Implementing a new endpoint
An example of an implemented feature includes the possibility to list bookings for the sit-panel. To do this the following files were created or changed: 

+ `backend/ntnui/apps/koie_booking/serializers/booking_sit.py`
+ `backend/ntnui/apps/koie_booking/tests/test_booking_sit_serializer.py`
+ `backend/ntnui/apps/koie_booking/urls.py`
+ `backend/ntnui/apps/koie_booking/views/booking_sit.py`
+ `backend/ntnui/tests/test_booking_sit.py` 

The main logic of the endpoint is located in [`booking_sit.py`](https://github.com/NTNUI/koiene-booking/blob/master/backend/ntnui/apps/koie_booking/views/booking_sit.py) 
So looking here might be a good start.
The created method for handling the specified GET-endpoint looks like this: 
```python
def list(self, request):
    """
    Gets bookings for sit view.
    QueryParams: [key_status, koie, arrival_date_start,
    arrival_date_end, departure_date_start, departure_date_end,
    order_by]
    Dates are provided in ISO-format: YYYY-MM-DD
    """
    # Filter on key_status
    self.queryset = self.filter_queryset_key_status()

    # Filter on koie
    koie = self.request.query_params.get("koie", None)
    if koie:
        self.queryset = self.queryset.filter(koie__slug=slugify(koie))

    # Filter on arrival_date
    arrival_date_start = self.request.query_params.get("arrival_date_start", None)
    if arrival_date_start:
        self.queryset = self.queryset.filter(arrival_date__gte=arrival_date_start)

    arrival_date_end = self.request.query_params.get("arrival_date_end", None)
    if arrival_date_end:
        self.queryset = self.queryset.filter(arrival_date__lte=arrival_date_end)

    # Filter on departure_date
    departure_date_start = self.request.query_params.get("departure_date_start", None)
    if departure_date_start:
        self.queryset = self.queryset.filter(departure_date__gte=departure_date_start)

    departure_date_end = self.request.query_params.get("departure_date_end", None)
    if departure_date_end:
        self.queryset = self.queryset.filter(departure_date__lte=departure_date_end)

    # Ordering
    order = self.request.query_params.get("order_by", None)
    if order and order in self.ordering_fields:
        self.queryset = self.queryset.order_by(order)
    else:
        self.queryset = self.queryset.order_by(self.ordering_fields[0])

    serializer = BookingSitSerializer(self.queryset, context={"request": request}, many=True)
    return Response(serializer.data)
 
```

### Implementing authentication for an endpoint
Authentication is an important part of having secure endpoints. To ensure this, make sure that every endpoint that you commit are tested for different access levels in the testing of your viewset. For inspiration see [the tests from the endpoint above](https://github.com/NTNUI/koiene-booking/blob/master/backend/ntnui/tests/test_booking_sit.py).

Here is a test method from that file that checks whether an unauthorized user is rejected or not:
```python
@pytest.mark.django_db
def test_list_booking_regular_user_should_fail(request_factory, booking, user, other_membership):
    request = request_factory.get(f"/koie/sit")
    response = get_response(request=request, user=other_membership.member)

    assert response.status_code == 403
```

The standard way of authenticating in `django-rest-framework` is to specify the wanted permission classes in the `permission_classes` field of your viewset, and django will handle it automatically. Here is a quick mock example:
```python
class MyViewSet(
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = DataModel.objects.all()
    serializer_class = DataSerializer
    lookup_field = "uuid"
    permission_classes = (IsAdmin | IsBoardMember, HasReadAccess)

    def retrieve(self, request, uuid):
        try:
            item = self.queryset.get(uuid=uuid)
            serializer = DataSerializer(item, context={"request": request})
            return Response(serializer.data)
        except DataModel.DoesNotExist:
            return Response({"detail": _("Booking not found.")}, status=404)
```

If custom authentication logic is required, for example if you only want authentication on some of the methods of a viewSet, you can create a custom permission class and implement the method `has_object_permission()`.
This will enable you to specifically call the permission check when you want in your viewset. This can be seen in the example below snipped from [`koie_dashboard.py`](https://github.com/NTNUI/koiene-booking/blob/master/backend/ntnui/apps/koie_booking/views/koie_dashboard.py)
```python
def list(self, request):
    """ List dashboard details of all koier from current date and given number of days forward
        {days} is supplied as query_parameter
    """
    if IsKoieAdmin.has_object_permission(request.user, request=request, view=self):
        days = request.query_params.get("days")
        if not days:
            days = constants.DEFAULT_BOOKING_WINDOW

        serializer = KoierDetailedSerializer(
            self.queryset, context={"request": request, "days": days}, many=True
        )
        return Response({"koier": serializer.data})
    else:
        return Response(
            {"detail": _("You must be a koie admin to access koie availability.")}, status=403
        )
```

## Detailed File Structure of the Backend
This is a detailed overview of the complete file structure of the back-end. Folders containing work by the kundestyre-group are expanded.
```
📦backend
 ┣ 📂ntnui
 ┃ ┣ 📂apps
 ┃ ┃ ┣ 📁accounts
 ┃ ┃ ┣ 📁groups
 ┃ ┃ ┣ 📂koie_booking
 ┃ ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┃ ┣ 📜booking.py
 ┃ ┃ ┃ ┃ ┣ 📜booking_payment.py
 ┃ ┃ ┃ ┃ ┣ 📜koie.py
 ┃ ┃ ┃ ┣ 📂factories
 ┃ ┃ ┃ ┃ ┣ 📜booking_factory.py
 ┃ ┃ ┃ ┃ ┣ 📜booking_payment_factory.py
 ┃ ┃ ┃ ┃ ┣ 📜description_factory.py
 ┃ ┃ ┃ ┃ ┣ 📜koie_factory.py
 ┃ ┃ ┃ ┃ ┣ 📜location_factory.py
 ┃ ┃ ┃ ┣ 📁migrations
 ┃ ┃ ┃ ┣ 📂models
 ┃ ┃ ┃ ┃ ┣ 📜booking.py
 ┃ ┃ ┃ ┃ ┣ 📜booking_payment.py
 ┃ ┃ ┃ ┃ ┣ 📜description.py
 ┃ ┃ ┃ ┃ ┣ 📜koie.py
 ┃ ┃ ┃ ┃ ┣ 📜location.py
 ┃ ┃ ┃ ┣ 📂reminder
 ┃ ┃ ┃ ┃ ┣ 📂management
 ┃ ┃ ┃ ┃ ┃ ┗ 📂commands
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜send_daily_departure_emails.py
 ┃ ┃ ┃ ┣ 📂serializers
 ┃ ┃ ┃ ┃ ┣ 📜all_koier.py
 ┃ ┃ ┃ ┃ ┣ 📜all_koier_detailed.py
 ┃ ┃ ┃ ┃ ┣ 📜booking.py
 ┃ ┃ ┃ ┃ ┣ 📜booking_sit.py
 ┃ ┃ ┃ ┃ ┣ 📜description.py
 ┃ ┃ ┃ ┃ ┣ 📜koie.py
 ┃ ┃ ┃ ┃ ┣ 📜location.py
 ┃ ┃ ┃ ┣ 📂templates
 ┃ ┃ ┃ ┃ ┣ 📜booking_confirmation.html
 ┃ ┃ ┃ ┃ ┣ 📜booking_confirmation.txt
 ┃ ┃ ┃ ┃ ┣ 📜checklist_reminder.html
 ┃ ┃ ┃ ┃ ┣ 📜checklist_reminder.txt
 ┃ ┃ ┃ ┃ ┣ 📜koie_information.html
 ┃ ┃ ┃ ┃ ┗ 📜koie_information.txt
 ┃ ┃ ┃ ┣ 📂tests
 ┃ ┃ ┃ ┃ ┣ 📜test_all_koier_detailed_serializer.py
 ┃ ┃ ┃ ┃ ┣ 📜test_all_koier_serializer.py
 ┃ ┃ ┃ ┃ ┣ 📜test_booking_model.py
 ┃ ┃ ┃ ┃ ┣ 📜test_booking_payment_model.py
 ┃ ┃ ┃ ┃ ┣ 📜test_booking_report_reminder.py
 ┃ ┃ ┃ ┃ ┣ 📜test_booking_serializer.py
 ┃ ┃ ┃ ┃ ┣ 📜test_booking_sit_serializer.py
 ┃ ┃ ┃ ┃ ┣ 📜test_date_utils.py
 ┃ ┃ ┃ ┃ ┣ 📜test_description_serializer.py
 ┃ ┃ ┃ ┃ ┣ 📜test_koie_model.py
 ┃ ┃ ┃ ┃ ┣ 📜test_koie_serializer.py
 ┃ ┃ ┃ ┃ ┣ 📜test_location_serializer.py
 ┃ ┃ ┃ ┃ ┗ 📜test_mail_utils.py
 ┃ ┃ ┃ ┣ 📁utils
 ┃ ┃ ┃ ┣ 📂views
 ┃ ┃ ┃ ┃ ┣ 📜booking.py
 ┃ ┃ ┃ ┃ ┣ 📜booking_sit.py
 ┃ ┃ ┃ ┃ ┣ 📜koie.py
 ┃ ┃ ┃ ┃ ┣ 📜koie_dashboard.py
 ┃ ┃ ┃ ┣ 📜apps.py
 ┃ ┃ ┃ ┣ 📜constants.py
 ┃ ┃ ┃ ┣ 📜README.md
 ┃ ┃ ┃ ┣ 📜urls.py
 ┃ ┃ ┣ 📂koie_report
 ┃ ┃ ┃ ┣ 📂factories
 ┃ ┃ ┃ ┃ ┗ 📜report_factory.py
 ┃ ┃ ┃ ┣ 📁migrations
 ┃ ┃ ┃ ┣ 📂tests
 ┃ ┃ ┃ ┃ ┣ 📜test_koie_report_model.py
 ┃ ┃ ┃ ┃ ┣ 📜test_koie_report_serializer.py
 ┃ ┃ ┃ ┃ ┗ 📜test_koie_report_serializer_filtered.py
 ┃ ┃ ┃ ┣ 📜admin.py
 ┃ ┃ ┃ ┣ 📜apps.py
 ┃ ┃ ┃ ┣ 📜models.py
 ┃ ┃ ┃ ┣ 📜permissions.py
 ┃ ┃ ┃ ┣ 📜report_serializer.py
 ┃ ┃ ┃ ┣ 📜urls.py
 ┃ ┃ ┃ ┣ 📜views.py
 ┃ ┃ ┣ 📁payments
 ┃ ┣ 📂fixture
 ┃ ┃ ┣ 📜booking.json
 ┃ ┃ ┣ 📜description.json
 ┃ ┃ ┣ 📜fixture.json
 ┃ ┃ ┣ 📜koier.json
 ┃ ┃ ┣ 📜koie_report.json
 ┃ ┃ ┗ 📜location.json
 ┃ ┣ 📁media
 ┃ ┣ 📁settings
 ┃ ┣ 📁static
 ┃ ┣ 📂tests
 ┃ ┃ ┣ 📜test_booking.py
 ┃ ┃ ┣ 📜test_booking_sit.py
 ┃ ┃ ┣ 📜test_constants.py
 ┃ ┃ ┣ 📜test_enums.py
 ┃ ┃ ┣ 📜test_koie.py
 ┃ ┃ ┣ 📜test_koie_availability.py
 ┃ ┃ ┣ 📜test_report.py
 ┃ ┃ ┣ 📜test_stripe_transaction_integration.py
 ┃ ┣ 📁utils
 ┃ ┣ 📜admin.py
 ┃ ┣ 📜enums.py
 ┃ ┣ 📜urls.py
 ┣ 📜.flake8
 ┣ 📜.pylintrc
 ┣ 📜manage.py
 ┣ 📜pyproject.toml
 ┣ 📜README.md
 ┣ 📜whitelist.txt
 ┗ 📜wsgi.py
```