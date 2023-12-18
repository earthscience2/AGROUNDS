from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.http import HttpResponse
from django.core.paginator import Paginator 
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from pytz import timezone
from datetime import datetime
from django.http import HttpResponse

#공통
#홈페이지(경력공유)
def home(request):
    return render(request,'home.jsx')#비로그인