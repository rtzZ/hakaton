import os
import uvicorn
from settings.server import app

if __name__ == "__main__":
    uvicorn.run(app, host=os.environ.get('LEARN_APP_HOST'), port=int(os.environ.get('LEARN_APP_PORT')))