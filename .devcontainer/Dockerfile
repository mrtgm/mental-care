FROM mcr.microsoft.com/devcontainers/go:latest

ARG username=dev

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends postgresql-client git curl unzip redis-tools zsh tmux
RUN sudo useradd --create-home --shell /bin/bash ${username}
RUN sudo usermod -aG sudo ${username}
RUN echo "${username} ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/${username}

# Go Environment
ENV GOPATH=/home/${username}/go
ENV PATH=${PATH}:${GOPATH}/bin
ENV PATH=${PATH}:/usr/local/go/bin
ENV PATH=${PATH}:/go/bin
RUN mkdir -p ${GOPATH} && chown -R ${username}:${username} ${GOPATH}

# install bun
ENV BUN_INSTALL=/bun
ENV BUN_TMPDIR=/bun/tmp

RUN mkdir -p /bun /bun/tmp \
    && curl -fsSL https://bun.sh/install | bash \
    && chown -R ${username}:${username} /bun \
    && chmod -R 755 /bun

ENV PATH=${BUN_INSTALL}/bin:${PATH} \
    BUN_DIR=${BUN_INSTALL}/.cache/bun \
    TMPDIR=${BUN_TMPDIR}

WORKDIR /workspace

# install zinit
RUN mkdir -p /home/${username}/.zinit \
    && git clone https://github.com/zdharma-continuum/zinit.git /home/${username}/.zinit/bin \
    && chown -R ${username}:${username} /home/${username}/.zinit

RUN echo "source /home/${username}/.zinit/bin/zinit.zsh" >> /home/${username}/.zshrc

RUN mkdir -p /home/${username}/.zshrc.d \
    && echo 'autoload -Uz _zinit' >> /home/${username}/.zshrc.d/zinit.zsh \
    && echo 'zinit light zdharma-continuum/fast-syntax-highlighting' >> /home/${username}/.zshrc.d/zinit.zsh \
    && echo 'zinit light zsh-users/zsh-autosuggestions' >> /home/${username}/.zshrc.d/zinit.zsh \
    && echo 'zinit light zsh-users/zsh-completions' >> /home/${username}/.zshrc.d/zinit.zsh \
    && echo 'source ~/.zshrc.d/zinit.zsh' >> /home/${username}/.zshrc \
    && chown -R ${username}:${username} /home/${username}/.zshrc.d

# install direnv
RUN curl -sfL https://direnv.net/install.sh | bash
RUN echo 'eval "$(direnv hook zsh)"' >> /home/${username}/.zshrc

# starship
RUN mkdir -p /home/${username}/.config && chown -R ${username}:${username} /home/${username}/.config
COPY --chown=${username}:${username} ./starship.toml /home/${username}/.config/starship.toml
RUN echo 'eval "$(starship init zsh)"' >> /home/${username}/.zshrc

# install just
RUN curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin

USER ${username}

# install air
RUN go install github.com/go-delve/delve/cmd/dlv@latest && \
    go install github.com/air-verse/air@latest

RUN bun install --global @biomejs/biome
RUN bun --version && go version

RUN chown -R ${username}:${username} /home/${username}/go
