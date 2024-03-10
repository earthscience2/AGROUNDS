from django.db import models

# DB폴더에서 이미 불러오고 있음 삭제필요
class UserInfo(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    user_id = models.CharField(max_length=45)
    password = models.CharField(max_length=200)
    user_birth = models.CharField(max_length=45)
    user_name = models.CharField(max_length=45)
    user_gender = models.CharField(max_length=45)
    user_nickname = models.CharField(max_length=45)
    marketing_agree = models.BooleanField()
    login_type = models.IntegerField()

    class Meta:
        managed = False
        db_table = "user_info"
