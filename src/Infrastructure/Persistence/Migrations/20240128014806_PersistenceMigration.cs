using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    username = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "identities",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    username = table.Column<string>(type: "text", nullable: false),
                    password = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_identities", x => x.id);
                    table.ForeignKey(
                        name: "fk_identities_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "proxies",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ip = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    port = table.Column<int>(type: "integer", nullable: false),
                    identity_id = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_proxies", x => x.id);
                    table.ForeignKey(
                        name: "fk_proxies_identities_identity_id",
                        column: x => x.identity_id,
                        principalTable: "identities",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_proxies_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "servers",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", maxLength: 50, nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ip = table.Column<string>(type: "text", nullable: false),
                    port = table.Column<int>(type: "integer", nullable: true),
                    startup_command = table.Column<string>(type: "text", nullable: true),
                    identity_id = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    proxy_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_servers", x => x.id);
                    table.ForeignKey(
                        name: "fk_servers_identities_identity_id",
                        column: x => x.identity_id,
                        principalTable: "identities",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_servers_proxies_proxy_id",
                        column: x => x.proxy_id,
                        principalTable: "proxies",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_servers_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "user_id", "username" },
                values: new object[] { 1L, 1L, "PowerBlaze" });

            migrationBuilder.CreateIndex(
                name: "ix_identities_user_id_title",
                table: "identities",
                columns: new[] { "user_id", "title" });

            migrationBuilder.CreateIndex(
                name: "ix_proxies_identity_id",
                table: "proxies",
                column: "identity_id");

            migrationBuilder.CreateIndex(
                name: "ix_proxies_user_id_title",
                table: "proxies",
                columns: new[] { "user_id", "title" });

            migrationBuilder.CreateIndex(
                name: "ix_servers_identity_id",
                table: "servers",
                column: "identity_id");

            migrationBuilder.CreateIndex(
                name: "ix_servers_name_user_id",
                table: "servers",
                columns: new[] { "name", "user_id" });

            migrationBuilder.CreateIndex(
                name: "ix_servers_proxy_id",
                table: "servers",
                column: "proxy_id");

            migrationBuilder.CreateIndex(
                name: "ix_servers_user_id",
                table: "servers",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_users_user_id",
                table: "users",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_username",
                table: "users",
                column: "username");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "servers");

            migrationBuilder.DropTable(
                name: "proxies");

            migrationBuilder.DropTable(
                name: "identities");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
