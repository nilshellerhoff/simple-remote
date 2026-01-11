package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net"
	"net/http"

	"github.com/go-vgo/robotgo"
	socketio "github.com/googollee/go-socket.io"
)

//go:embed webroot/*
var webroot embed.FS

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
	webfiles, _ := fs.Sub(webroot, "webroot")
	http.Handle("/", http.FileServerFS(webfiles))

	ips, _ := net.InterfaceAddrs()
	ip_address := "N/A"

	for _, ip := range ips {
		if ipnet, ok := ip.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				ip_address = ipnet.IP.String()
				break
			}
		}
	}

	log.Printf("Open your phone browser at %s:8000\n", ip_address)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
