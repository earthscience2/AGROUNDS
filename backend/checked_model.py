# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class UserAnalMatch(models.Model):
    anal_code = models.AutoField(primary_key=True)
    match_code = models.CharField(max_length=45, blank=True, null=True)
    user_code = models.CharField(max_length=45, blank=True, null=True)
    ground_code = models.CharField(max_length=45, blank=True, null=True)
    quarter_name = models.CharField(max_length=45, blank=True, null=True)
    start = models.DateTimeField(blank=True, null=True)
    end = models.DateTimeField(blank=True, null=True)
    position = models.CharField(max_length=45, blank=True, null=True)
    home = models.CharField(max_length=45, blank=True, null=True)
    t_d = models.FloatField(db_column='T_D', blank=True, null=True)  # Field name made lowercase.
    t_t = models.IntegerField(db_column='T_T', blank=True, null=True)  # Field name made lowercase.
    t_dpm = models.FloatField(db_column='T_DPM', blank=True, null=True)  # Field name made lowercase.
    t_ldt = models.IntegerField(db_column='T_LDT', blank=True, null=True)  # Field name made lowercase.
    t_ldt_l = models.JSONField(db_column='T_LDT_L', blank=True, null=True)  # Field name made lowercase.
    t_hdt = models.IntegerField(db_column='T_HDT', blank=True, null=True)  # Field name made lowercase.
    t_hdt_l = models.JSONField(db_column='T_HDT_L', blank=True, null=True)  # Field name made lowercase.
    t_mr = models.FloatField(db_column='T_MR', blank=True, null=True)  # Field name made lowercase.
    t_h_l = models.JSONField(db_column='T_H_L', blank=True, null=True)  # Field name made lowercase.
    t_as = models.FloatField(db_column='T_AS', blank=True, null=True)  # Field name made lowercase.
    t_hs = models.FloatField(db_column='T_HS', blank=True, null=True)  # Field name made lowercase.
    t_hs_t = models.CharField(db_column='T_HS_T', max_length=45, blank=True, null=True)  # Field name made lowercase.
    t_as_l = models.JSONField(db_column='T_AS_L', blank=True, null=True)  # Field name made lowercase.
    t_ias = models.FloatField(db_column='T_IAS', blank=True, null=True)  # Field name made lowercase.
    t_mas = models.FloatField(db_column='T_MAS', blank=True, null=True)  # Field name made lowercase.
    t_fas = models.FloatField(db_column='T_FAS', blank=True, null=True)  # Field name made lowercase.
    t_mdas = models.FloatField(db_column='T_MDAS', blank=True, null=True)  # Field name made lowercase.
    t_hts = models.FloatField(db_column='T_HTS', blank=True, null=True)  # Field name made lowercase.
    t_lts = models.FloatField(db_column='T_LTS', blank=True, null=True)  # Field name made lowercase.
    t_gs = models.FloatField(db_column='T_GS', blank=True, null=True)  # Field name made lowercase.
    t_aa = models.FloatField(db_column='T_AA', blank=True, null=True)  # Field name made lowercase.
    t_ha = models.FloatField(db_column='T_HA', blank=True, null=True)  # Field name made lowercase.
    t_ha_t = models.CharField(db_column='T_HA_T', max_length=45, blank=True, null=True)  # Field name made lowercase.
    t_aa_l = models.JSONField(db_column='T_AA_L', blank=True, null=True)  # Field name made lowercase.
    t_s = models.IntegerField(db_column='T_S', blank=True, null=True)  # Field name made lowercase.
    t_asd = models.FloatField(db_column='T_ASD', blank=True, null=True)  # Field name made lowercase.
    t_ass = models.FloatField(db_column='T_ASS', blank=True, null=True)  # Field name made lowercase.
    t_asa = models.FloatField(db_column='T_ASA', blank=True, null=True)  # Field name made lowercase.
    t_tsd = models.FloatField(db_column='T_TSD', blank=True, null=True)  # Field name made lowercase.
    t_hsd = models.FloatField(db_column='T_HSD', blank=True, null=True)  # Field name made lowercase.
    t_lsd = models.FloatField(db_column='T_LSD', blank=True, null=True)  # Field name made lowercase.
    t_sdpd = models.FloatField(db_column='T_SDPD', blank=True, null=True)  # Field name made lowercase.
    t_s_l = models.JSONField(db_column='T_S_L', blank=True, null=True)  # Field name made lowercase.
    t_hss = models.FloatField(db_column='T_HSS', blank=True, null=True)  # Field name made lowercase.
    t_hsa = models.FloatField(db_column='T_HSA', blank=True, null=True)  # Field name made lowercase.
    a_d = models.FloatField(db_column='A_D', blank=True, null=True)  # Field name made lowercase.
    a_t = models.IntegerField(db_column='A_T', blank=True, null=True)  # Field name made lowercase.
    a_tpt = models.IntegerField(db_column='A_TPT', blank=True, null=True)  # Field name made lowercase.
    a_dpm = models.FloatField(db_column='A_DPM', blank=True, null=True)  # Field name made lowercase.
    a_ldt = models.FloatField(db_column='A_LDT', blank=True, null=True)  # Field name made lowercase.
    a_ldt_l = models.JSONField(db_column='A_LDT_L', blank=True, null=True)  # Field name made lowercase.
    a_hdt = models.FloatField(db_column='A_HDT', blank=True, null=True)  # Field name made lowercase.
    a_hdt_l = models.JSONField(db_column='A_HDT_L', blank=True, null=True)  # Field name made lowercase.
    a_mr = models.FloatField(db_column='A_MR', blank=True, null=True)  # Field name made lowercase.
    a_h_l = models.JSONField(db_column='A_H_L', blank=True, null=True)  # Field name made lowercase.
    a_as = models.FloatField(db_column='A_AS', blank=True, null=True)  # Field name made lowercase.
    a_hs = models.FloatField(db_column='A_HS', blank=True, null=True)  # Field name made lowercase.
    a_hs_t = models.CharField(db_column='A_HS_T', max_length=45, blank=True, null=True)  # Field name made lowercase.
    a_hts = models.FloatField(db_column='A_HTS', blank=True, null=True)  # Field name made lowercase.
    a_lts = models.FloatField(db_column='A_LTS', blank=True, null=True)  # Field name made lowercase.
    a_gs = models.FloatField(db_column='A_GS', blank=True, null=True)  # Field name made lowercase.
    a_aa = models.FloatField(db_column='A_AA', blank=True, null=True)  # Field name made lowercase.
    a_ha = models.FloatField(db_column='A_HA', blank=True, null=True)  # Field name made lowercase.
    a_ha_t = models.CharField(db_column='A_HA_T', max_length=45, blank=True, null=True)  # Field name made lowercase.
    d_d = models.FloatField(db_column='D_D', blank=True, null=True)  # Field name made lowercase.
    d_t = models.IntegerField(db_column='D_T', blank=True, null=True)  # Field name made lowercase.
    d_tpt = models.IntegerField(db_column='D_TPT', blank=True, null=True)  # Field name made lowercase.
    d_dpm = models.FloatField(db_column='D_DPM', blank=True, null=True)  # Field name made lowercase.
    d_ldt = models.IntegerField(db_column='D_LDT', blank=True, null=True)  # Field name made lowercase.
    d_ldt_l = models.JSONField(db_column='D_LDT_L', blank=True, null=True)  # Field name made lowercase.
    d_hdt = models.FloatField(db_column='D_HDT', blank=True, null=True)  # Field name made lowercase.
    d_hdt_l = models.JSONField(db_column='D_HDT_L', blank=True, null=True)  # Field name made lowercase.
    d_mr = models.FloatField(db_column='D_MR', blank=True, null=True)  # Field name made lowercase.
    d_h_l = models.JSONField(db_column='D_H_L', blank=True, null=True)  # Field name made lowercase.
    d_as = models.FloatField(db_column='D_AS', blank=True, null=True)  # Field name made lowercase.
    d_hs = models.FloatField(db_column='D_HS', blank=True, null=True)  # Field name made lowercase.
    d_hs_t = models.CharField(db_column='D_HS_T', max_length=45, blank=True, null=True)  # Field name made lowercase.
    d_hts = models.FloatField(db_column='D_HTS', blank=True, null=True)  # Field name made lowercase.
    d_lts = models.FloatField(db_column='D_LTS', blank=True, null=True)  # Field name made lowercase.
    d_gs = models.FloatField(db_column='D_GS', blank=True, null=True)  # Field name made lowercase.
    d_aa = models.FloatField(db_column='D_AA', blank=True, null=True)  # Field name made lowercase.
    d_ha = models.FloatField(db_column='D_HA', blank=True, null=True)  # Field name made lowercase.
    d_ha_t = models.CharField(db_column='D_HA_T', max_length=45, blank=True, null=True)  # Field name made lowercase.
    point = models.JSONField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_anal_match'
