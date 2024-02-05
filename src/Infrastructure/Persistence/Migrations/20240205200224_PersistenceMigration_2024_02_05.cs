using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_02_05 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_proxies_proxy_id",
                table: "servers");

            migrationBuilder.AddColumn<long>(
                name: "server_type_id",
                table: "servers",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "server_types",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    photo = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_server_types", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_servers_server_type_id",
                table: "servers",
                column: "server_type_id");

            migrationBuilder.AddForeignKey(
                name: "fk_servers_proxies_proxy_id",
                table: "servers",
                column: "proxy_id",
                principalTable: "proxies",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_servers_server_types_server_type_id",
                table: "servers",
                column: "server_type_id",
                principalTable: "server_types",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_proxies_proxy_id",
                table: "servers");

            migrationBuilder.DropForeignKey(
                name: "fk_servers_server_types_server_type_id",
                table: "servers");

            migrationBuilder.DropTable(
                name: "server_types");

            migrationBuilder.DropIndex(
                name: "ix_servers_server_type_id",
                table: "servers");

            migrationBuilder.DropColumn(
                name: "server_type_id",
                table: "servers");

            migrationBuilder.AddForeignKey(
                name: "fk_servers_proxies_proxy_id",
                table: "servers",
                column: "proxy_id",
                principalTable: "proxies",
                principalColumn: "id");
        }
    }
}
