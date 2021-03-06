# Generated by Django 3.0.10 on 2020-09-15 13:54

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StripeTransaction',
            fields=[
                ('id', models.UUIDField(auto_created=True, default=uuid.uuid4, primary_key=True, serialize=False, verbose_name='ID')),
                ('charge_id', models.CharField(blank=True, max_length=40)),
                ('token_id', models.CharField(blank=True, max_length=40)),
                ('stripe_status', models.CharField(blank=True, default='created', max_length=40)),
                ('payment_related_name', models.CharField(max_length=80)),
            ],
            options={
                'verbose_name': 'Stripe Transaction',
                'verbose_name_plural': 'Stripe Transactions',
            },
        ),
    ]
