let
  sources = import ./nix/sources.nix { };
  pkgs = import sources.nixpkgs { };
  inherit (pkgs.lib) optionals;

  basePackages = [ pkgs.git pkgs.nixfmt pkgs.nodejs pkgs.yarn ];

  inputs = basePackages ++ optionals pkgs.stdenv.isLinux pkgs.inotify-tools
  ++ optionals pkgs.stdenv.isDarwin (with pkgs.darwin.apple_sdk.frameworks; [
    # https://github.com/NixOS/nixpkgs/blob/master/pkgs/os-specific/darwin/apple-sdk/frameworks.nix
    CoreFoundation
    CoreServices
  ]);

  hooks = ''
    mkdir -p .nix-node
    export NODE_PATH=$PWD/.nix-node
    export NPM_CONFIG_PREFIX=$PWD/.nix-node
    export PATH=$NODE_PATH/bin:$PATH
  '';
in pkgs.mkShell {
  buildInputs = inputs;
  shellHook = hooks;
}
