# Generated by Django 4.0.5 on 2022-06-17 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('safe_area', '0003_alter_event_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='type_of_situation',
            field=models.CharField(choices=[('murder', 'Murder'), ('accident', 'Accident'), ('fight', 'Fight'), ('theft', 'Theft'), ('shooting', 'Shooting'), ('other', 'Other')], default='other', max_length=20),
        ),
    ]
