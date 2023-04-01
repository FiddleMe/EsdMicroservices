FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./placeOrder.py ./invokes.py ./
CMD [ "python", "./placeOrder.py" ]