from django.conf.urls import url, include
from rest_framework import routers
from api.rest import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'homes', views.HomeViewSet)
router.register(r'agents', views.AgentViewSet)
router.register(r'agency', views.AgencyViewSet)
# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
