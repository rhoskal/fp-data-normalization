{ pkgs ? import <nixpkgs> {} }:

with pkgs;

let
  inherit (lib) optional optionals;

  basePackages = [
    nodejs
    yarn
  ];

  inputs = basePackages;
in

mkShell {
  buildInputs = inputs;
}

