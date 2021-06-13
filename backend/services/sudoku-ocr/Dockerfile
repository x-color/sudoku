FROM gocv/opencv:4.5.2

RUN apt update \
    && apt install -y apt-transport-https \
    && echo "deb https://notesalexp.org/tesseract-ocr/buster/ buster main" >> /etc/apt/sources.list \
    && apt update -oAcquire::AllowInsecureRepositories=true \
    && apt install -y --allow-unauthenticated notesalexp-keyring -oAcquire::AllowInsecureRepositories=true \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN apt update \
    && apt install -y \
    tesseract-ocr=4.1.1+git4247-97079fa3-1 \
    libleptonica-dev=1.78.0-1+nmu1 \
    libtesseract-dev=4.1.1+git4247-97079fa3-1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN wget -P /usr/share/tesseract-ocr/4.00/tessdata https://github.com/USCDataScience/counterfeit-electronics-tesseract/raw/master/Training%20Tesseract/snum.traineddata

ENTRYPOINT [ "/bin/bash" ]
