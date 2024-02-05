using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_02_05T23_20 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "server_types",
                columns: new[] { "id", "name", "photo" },
                values: new object[,]
                {
                    { 1L, "Windows", "/ServerTypes/windows.svg" },
                    { 2L, "ArchLinux", "/ServerTypes/arch-linux.svg" },
                    { 3L, "OpenSuse", "/ServerTypes/opensuse.svg" },
                    { 4L, "Fedora", "/ServerTypes/fedora.svg" },
                    { 5L, "CentOS", "/ServerTypes/centos.svg" },
                    { 6L, "Debian", "/ServerTypes/debian.svg" },
                    { 7L, "MacOS", "/ServerTypes/macos.svg" },
                    { 8L, "Ubuntu", "/ServerTypes/ubuntu.svg" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "server_types",
                keyColumn: "id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "server_types",
                keyColumn: "id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "server_types",
                keyColumn: "id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "server_types",
                keyColumn: "id",
                keyValue: 4L);

            migrationBuilder.DeleteData(
                table: "server_types",
                keyColumn: "id",
                keyValue: 5L);

            migrationBuilder.DeleteData(
                table: "server_types",
                keyColumn: "id",
                keyValue: 6L);

            migrationBuilder.DeleteData(
                table: "server_types",
                keyColumn: "id",
                keyValue: 7L);

            migrationBuilder.DeleteData(
                table: "server_types",
                keyColumn: "id",
                keyValue: 8L);
        }
    }
}
