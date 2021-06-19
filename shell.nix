{ pkgs ? import <nixpkgs> {} }:

with pkgs;

let
  basePackages = [
    git
    nodejs-14_x
    # the default yarn uses the current version of nodejs in <nixpkgs> so we need to tell it to use an older version
    (yarn.override { nodejs = nodejs-14_x; })
    yarn
  ];

  inputs = basePackages;
in
  mkShell {
    buildInputs = inputs;
  }
