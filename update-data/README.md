This folder contains the exact script files to recreate the ```update_dailies``` function in GCP cloud functions using the ```update_dailies_trigger``` pub/sub trigger.

The function was removed because the SEC is banning the GCP IP with an error message of too many messages in one second. The scripts aren't sending too many requests per second (```time.sleep(1)``` to ensure this is the case). I'm guessing this is because the SEC blocks the GCP IPs to block bots so automating this function won't be possible. I'm keeping the code here in case it becomes a possibility in the future.

The stock boy firebase access json also needs to be added to the function and must be named ```stock-boy-firebase.json```.