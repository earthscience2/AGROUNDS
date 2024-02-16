from django.db import models

# Create your models here.
class User_info(models.Model):
    user_code = models.CharField(primary_key=True, max_length=45)
    user_id = models.CharField(max_length=45)
    password = models.CharField(max_length=45)
    user_birth = models.CharField(max_length=45)
    user_name = models.CharField(max_length=45)
    user_gender = models.CharField(max_length=45)
    user_nickname = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'user_info'
