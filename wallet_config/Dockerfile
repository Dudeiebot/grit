# Use Python 3.11 as a base image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files (including manage.py)
COPY . .

# Start the server
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:8000 --access-logfile - core_config.wsgi:application"]
