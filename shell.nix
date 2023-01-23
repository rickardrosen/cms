with import <nixpkgs> { };

stdenv.mkDerivation {
  name = "node";
  buildInputs = [
    nodejs-18_x
    nodePackages.typescript-language-server
  ];
  shellHook = ''
    export PATH="$PWD/node_modules/.bin/:$PATH"
    alias vi=nvim
  '';
}
