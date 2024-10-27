from django.db import models

class TestAnalyzeData(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    user_name = models.CharField(max_length=45, blank=True)
    user_type = models.CharField(max_length=20),
    user_position = models.CharField(max_length=45, blank=True),
    team_players = models.JSONField()

    class Meta:
        managed = False
        db_table = 'test_analyze_data'