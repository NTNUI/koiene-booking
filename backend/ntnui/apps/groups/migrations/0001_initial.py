# Generated by Django 3.0.9 on 2020-09-29 15:41

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import enumchoicefield.fields
import groups.models.membership
import ntnui.enums


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupModel',
            fields=[
                ('group_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=40)),
                ('founding_date', models.DateField(default=datetime.date.today)),
                ('slug', models.SlugField(editable=False)),
                ('access', models.CharField(choices=[('O', 'Open'), ('C', 'Closed'), ('H', 'Hidden')], default='O', max_length=20)),
                ('category', enumchoicefield.fields.EnumChoiceField(default=ntnui.enums.GroupCategory(1), enum_class=ntnui.enums.GroupCategory, max_length=20)),
                ('payment_key', models.CharField(blank=True, max_length=40, null=True)),
            ],
            options={
                'verbose_name': 'Group',
                'verbose_name_plural': 'Groups',
            },
        ),
        migrations.CreateModel(
            name='MembershipModel',
            fields=[
                ('membership_no', models.AutoField(primary_key=True, serialize=False)),
                ('date_joined', models.DateField(default=datetime.date.today)),
                ('group_expiry', models.DateField(default=groups.models.membership.one_year_from_today)),
                ('type', enumchoicefield.fields.EnumChoiceField(default=ntnui.enums.MembershipType(7), enum_class=ntnui.enums.MembershipType, max_length=19)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.GroupModel')),
                ('member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Membership',
                'verbose_name_plural': 'Memberships',
                'unique_together': {('member', 'group')},
            },
        ),
        migrations.AddField(
            model_name='groupmodel',
            name='members',
            field=models.ManyToManyField(through='groups.MembershipModel', to=settings.AUTH_USER_MODEL),
        ),
    ]
