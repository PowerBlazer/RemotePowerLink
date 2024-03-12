using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_03_13T01_56 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_proxies_proxy_id",
                table: "servers");

            migrationBuilder.AddForeignKey(
                name: "fk_servers_proxies_proxy_id",
                table: "servers",
                column: "proxy_id",
                principalTable: "proxies",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_proxies_proxy_id",
                table: "servers");

            migrationBuilder.AddForeignKey(
                name: "fk_servers_proxies_proxy_id",
                table: "servers",
                column: "proxy_id",
                principalTable: "proxies",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
