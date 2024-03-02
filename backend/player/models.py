from django.db import models

class PlayerInfo(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    player_height = models.IntegerField(blank=True)
    player_weight = models.IntegerField(blank=True)
    player_point = models.IntegerField()
    player_area = models.CharField(max_length=45, blank=True)
    player_position = models.CharField(max_length=45, blank=True)
    player_description = models.CharField(max_length=200, blank=True)
    player_goal = models.IntegerField()
    player_assist = models.IntegerField()
    player_foot = models.CharField(max_length=10, blank=True)
    player_num = models.IntegerField(blank=True)
    player_team = models.CharField(max_length=45, blank=True)

    class Meta:
        managed = False
        db_table = "player_info"