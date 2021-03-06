# Generated by Django 3.0.10 on 2020-09-15 13:54

import accounts.utils.user_manager
import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import enumchoicefield.fields
import ntnui.enums
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserModel',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('first_name', models.CharField(max_length=40)),
                ('last_name', models.CharField(max_length=40)),
                ('date_of_birth', models.DateField(null=True)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('-', 'N/A')], default='-', max_length=10)),
                ('ntnui_no', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('customer_no', models.CharField(blank=True, max_length=20, null=True, unique=True)),
                ('register_date', models.DateField(default=datetime.date.today)),
                ('card_no', models.CharField(blank=True, max_length=50, null=True)),
                ('language', models.CharField(choices=[('nb', 'Norwegian'), ('en', 'English')], default='no', max_length=5)),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(max_length=128, null=True, region=None)),
                ('email', models.EmailField(max_length=100, unique=True, verbose_name='email')),
                ('contact_email', models.EmailField(blank=True, max_length=100, null=True, verbose_name='contact email')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
            },
            managers=[
                ('objects', accounts.utils.user_manager.CustomUserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('expiry_date', models.DateField(null=True)),
                ('type', enumchoicefield.fields.EnumChoiceField(default=ntnui.enums.ContractType(1), enum_class=ntnui.enums.ContractType, max_length=25)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contracts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Contract',
                'verbose_name_plural': 'Contracts',
            },
        ),
    ]
