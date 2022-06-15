# Generated by Django 4.0.5 on 2022-06-12 15:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('lat', models.FloatField(default=0)),
                ('lon', models.FloatField(default=0)),
                ('description', models.TextField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='EventMedia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('file', models.FileField(upload_to='events')),
                ('extension', models.CharField(choices=[('video', 'Video'), ('image', 'Image')], default='image', max_length=10)),
                ('event', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='safe_area.event')),
            ],
        ),
    ]
