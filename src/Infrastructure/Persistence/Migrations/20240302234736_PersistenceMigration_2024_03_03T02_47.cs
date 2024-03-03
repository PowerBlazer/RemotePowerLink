using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_03_03T02_47 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "port",
                table: "servers",
                newName: "ssh_port");

            migrationBuilder.RenameColumn(
                name: "port",
                table: "proxies",
                newName: "ssh_port");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ssh_port",
                table: "servers",
                newName: "port");

            migrationBuilder.RenameColumn(
                name: "ssh_port",
                table: "proxies",
                newName: "port");
        }
    }
}
