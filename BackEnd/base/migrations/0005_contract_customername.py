# Generated by Django 4.1.7 on 2024-01-10 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_contract_firstapt'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='customerName',
            field=models.CharField(default='', max_length=200),
        ),
    ]