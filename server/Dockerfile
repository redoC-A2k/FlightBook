FROM python:3.12-slim-bullseye
RUN mkdir server
ADD controller /server/controller
ADD app.py /server/
ADD db.py /server/
ADD requirements.txt /server/
RUN pip install -r server/requirements.txt
RUN apt-get update && apt-get install -y curl
WORKDIR /server
# ENTRYPOINT [ "gunicorn", "app:app" ]
