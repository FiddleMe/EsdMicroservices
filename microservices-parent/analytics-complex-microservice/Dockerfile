FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
COPY nltk_download.py ./
RUN python -m pip install --no-cache-dir -r requirements.txt
RUN python3 nltk_download.py
COPY ./analytics.py ./invokes.py  ./
CMD [ "python", "./analytics.py" ]