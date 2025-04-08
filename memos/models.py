from django.db import models
from django.conf import settings
from tasks.models import Task


class Memo(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="memos",
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="memos",
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Memo by {self.user.username} on {self.task.title}"
