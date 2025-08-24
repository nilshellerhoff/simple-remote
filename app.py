from pynput.mouse import Controller as MouseController, Button
from pynput.keyboard import Controller as KeyboardController, Key
from flask import Flask, render_template
from flask_socketio import emit, SocketIO
from engineio.async_drivers import threading

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

socketio = SocketIO(app, async_mode="threading")
mouse = MouseController()
keyboard = KeyboardController()


def limit_to_range(x):
    """Limit the mouse movement to the range available in pynput"""
    if x < -2 ** 15:
        return -2 ** 15
    elif x > 2 ** 15:
        return 2 ** 15
    else:
        return x


@app.route('/')
def hello_world():  # put application's code here
    return render_template('base.html')


# Handle user messages
@socketio.on('event')
def handle_event(data):
    print(data)


@socketio.on('mouse-move')
def handle_mouse_move(data):
    x = limit_to_range(data[0])
    y = limit_to_range(data[1])
    mouse.move(x, y)


@socketio.on('mouse-click')
def handle_click():
    mouse.click(Button.left)


@socketio.on('horizontal-scroll')
def handle_horizontal_scroll(data):
    mouse.scroll(-1 * data, 0)


@socketio.on('vertical-scroll')
def handle_vertical_scroll(data):
    mouse.scroll(0, data)


# Keyboard
@socketio.on('special-key')
def handle_special_key(data):
    try:
        key = Key[data]
        keyboard.press(key)
        keyboard.release(key)
    except KeyError:
        print("Invalid special key {data} requested.")


if __name__ == '__main__':
    socketio.run(app, debug=False, host='0.0.0.0')
