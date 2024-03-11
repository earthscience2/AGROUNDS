from django.db import models
from django.contrib.postgres.fields import JSONField

# DB폴더에서 이미 불러오고 있음 삭제필요
class TeamInfo(models.Model):
    team_code = models.CharField(primary_key=True, max_length=45)
    team_host = models.CharField(max_length=45, blank=True)
    team_name = models.CharField(max_length=45, blank=True)
    team_player = models.JSONField(blank=True)
    team_logo = models.CharField(max_length=45, blank=True, null=True)
    team_point = models.IntegerField(blank=True, null=True)
    team_area = models.CharField(max_length=45, blank=True)
    team_description = models.CharField(max_length=45, blank=True, null=True)
    

    class Meta:
        managed = False
        db_table = 'team_info'
