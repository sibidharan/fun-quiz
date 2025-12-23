#!/bin/sh
(until php /home/sibidharan/fun_quiz/app.php; do
    echo "'php /home/sibidharan/fun_quiz/app.php' crashed with exit code $?. Restarting..." >&2
    sleep 1
done) &