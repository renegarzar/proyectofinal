FROM python:3.9
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
RUN mkdir -p storage
EXPOSE 5000
CMD ["python", "app.py"]
