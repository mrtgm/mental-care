package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/caarlos0/env/v10"
)

type Config struct {
	Env  string `env:"ENV" envDefault:"production"`
	Port string `env:"PORT"`
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, world?!!")
}

func main() {
	cfg := Config{}
	if err := env.Parse(&cfg); err != nil {
		log.Fatalf("failed to parse env: %v", err)
	}

	// ポートが指定されていなければ ENV に応じて決める
	if cfg.Port == "" {
		if cfg.Env == "development" {
			cfg.Port = "8081"
		} else {
			cfg.Port = "8080"
		}
	}

	http.HandleFunc("/", helloHandler)
	fmt.Printf("Server running on :%s (ENV=%s)\n", cfg.Port, cfg.Env)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, nil))
}
