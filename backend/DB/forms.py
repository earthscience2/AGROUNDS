from django import forms

class ImageUploadForm(forms.Form):
    v2_team_logo = forms.ImageField()