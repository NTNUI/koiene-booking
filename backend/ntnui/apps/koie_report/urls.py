from django.urls import path

from koie_report.views import ReportViewSet

"""Declares separate endpoints for post request and get request. """

urlpatterns = [
    path("reports/", ReportViewSet.as_view({"get": "list"}), name="koie_report_list"),
    path("reports/<pk>", ReportViewSet.as_view({"post": "create"}), name="koie_create"),
]
