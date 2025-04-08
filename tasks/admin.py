from django.contrib import admin
from .models import Task


class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'is_completed', 'due_date')
    list_filter = ('is_completed', 'due_date')
    search_fields = ('title', 'description')


admin.site.register(Task, TaskAdmin)