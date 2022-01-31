export AUDIODRIVER=alsa
cd ~/TeleFrame
while ! ping -c 1 -W 1 8.8.8.8; do
    echo "Waiting for 1.2.3.4 - network interface might be down..."
    sleep 5
done
DISPLAY=:0 npm run botonly
