from django.shortcuts import render
from rest_framework.response import Response 
from rest_framework.views import APIView
from rest_framework import status
from .serializers import *



class playerAnalyze(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data

        # Instantiate serializers
        heatmap_serializer = S3HeatmapURL(data=data)
        route_serializer = S3RouteURL(data=data)
        vector_serializer = S3VectorURL(data=data)
        Vod_serializer = S3VodURL(data=data)
        # Initialize results dictionary
        results = {}
        errors = {}

        # Validate each serializer and gather the results or errors
        serializers = [
            (heatmap_serializer, 'heatmap_url'),
            (route_serializer, 'route_url'),
            (vector_serializer, 'vector_url'),
            (Vod_serializer, 'vod_url')
        ]
        
        for serializer, key in serializers:
            if serializer.is_valid():
                result = serializer.save()
                results[key] = result['file_url']
            else:
                errors[key] = serializer.errors

        if not errors:
            return Response(results, status=status.HTTP_200_OK)
        else:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)