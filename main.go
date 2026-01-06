package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-vgo/robotgo"
	socketio "github.com/googollee/go-socket.io"
)

func main() {
	server := socketio.NewServer(nil)

	server.OnEvent("/", "mouse-move", func(s socketio.Conn, data [2]float32) {
		fmt.Println("mouse-move", data)
		robotgo.MoveRelative(int(data[0]), int(data[1]))
	})

	server.OnEvent("/", "mouse-click", func(s socketio.Conn) {
		fmt.Println("mouse-click")
		robotgo.Click()
	})

	server.OnEvent("/", "vertical-scroll", func(s socketio.Conn, y float32) {
		fmt.Println("vertical-scroll", y)
		robotgo.Scroll(0, int(y))
	})

	server.OnEvent("/", "horizontal-scroll", func(s socketio.Conn, x float32) {
		fmt.Println("horizontal-scroll", x)
		robotgo.Scroll(int(x), 0)
	})

	server.OnEvent("/", "special-key", func(s socketio.Conn, key string) {
		fmt.Println("special-key", key)
		robotgo.KeyTap(key)
	})

	go server.Serve()
	defer server.Close()

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./webroot")))
	log.Println("Serving at localhost:8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
