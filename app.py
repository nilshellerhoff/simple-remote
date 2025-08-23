from pynput.mouse import Controller as MouseController, Button
from pynput.keyboard import Controller as KeyboardController, Key
from flask import Flask, render_template
from flask_socketio import emit, SocketIO

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

socketio = SocketIO(app)
mouse = MouseController()
keyboard = KeyboardController()

@app.route('/')
def hello_world():  # put application's code here
    return render_template('base.html')

# Handle user messages
@socketio.on('event')
def handle_event(data):
    print(data)

@socketio.on('mouse-move')
def handle_mouse_move(data):
    mouse.move(*data)

@socketio.on('mouse-click')
def handle_click():
    mouse.click(Button.left)

@socketio.on('horizontal-scroll')
def handle_pandown(data):
    try:
        mouse.scroll(data, 0)
    except Exception as e:
        print("Exception scrolling", e)
    print("pandown")
    print(data)

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
    socketio.run(app, debug=True, host='0.0.0.0')
