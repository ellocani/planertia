from rest_framework.routers import DefaultRouter
from .views import MemoViewSet

router = DefaultRouter()
router.register(r"", MemoViewSet, basename="memo")

urlpatterns = router.urls
