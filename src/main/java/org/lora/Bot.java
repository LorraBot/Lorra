package org.lora;

import io.github.cdimascio.dotenv.Dotenv;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder;

public class Bot {

    public static Dotenv environment() { return Dotenv.load(); }

    public static void main(String[] args) {
        DefaultShardManagerBuilder builder = DefaultShardManagerBuilder.createDefault(environment().get("TOKEN"));
        builder.disableIntents(GatewayIntent.GUILD_PRESENCES);
        builder.build();
    }
}
