from django.db import models

class TestUserInfo(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    user_name = models.CharField(max_length=45, blank=True)
    user_type = models.CharField(max_length=20, default='player')
    user_position = models.CharField(max_length=45, blank=True)
    team_players = models.JSONField()

    class Meta:
        managed = False
        db_table = 'test_user_info'

class TestAnalyzeData(models.Model):
    anal_code = models.CharField(primary_key=True, max_length=45)
    match_code = models.CharField(max_length=45, default='m_000')
    user_code = models.CharField(max_length=45, default='u_000')
    user_id = models.CharField(max_length=45, default='000000')
    match_date = models.CharField(max_length=20, default='20000101')
    match_number = models.IntegerField(default=0)
    quarter = models.IntegerField(default=0)
    match_type = models.CharField(max_length=45, default='all')

    class Meta:
        managed = False
        db_table = 'test_analyze_data'

        #주석