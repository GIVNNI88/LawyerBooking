# Generated by Django 4.1.7 on 2024-01-10 14:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_contract_customername'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='phoneNumber',
            field=models.CharField(default='', max_length=200),
        ),
    ]
