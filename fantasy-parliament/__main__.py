# coding=utf-8

import os
from routes import application

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    application.run('0.0.0.0', port, debug=True)
