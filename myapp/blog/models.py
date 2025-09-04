import uuid
from django.db import models

# Create your models here.
class Blog(models.Model):
    id = models.UUIDField(
        primary_key=True,      # đặt làm khóa chính
        default=uuid.uuid4,    # tự động sinh UUID
        editable=False         # không cho sửa tay
    )
    title = models.CharField(max_length=200)      
    content = models.TextField()                
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)   

    def __str__(self):
        return self.title 