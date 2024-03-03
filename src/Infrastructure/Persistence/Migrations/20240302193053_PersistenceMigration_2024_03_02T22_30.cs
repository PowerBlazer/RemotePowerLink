using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_03_02T22_30 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_system_types_server_type_id",
                table: "servers");

            migrationBuilder.DropIndex(
                name: "ix_servers_server_type_id",
                table: "servers");

            migrationBuilder.DropColumn(
                name: "server_type_id",
                table: "servers");

            migrationBuilder.RenameColumn(
                name: "photo",
                table: "system_types",
                newName: "icon_path");

            migrationBuilder.AddColumn<long>(
                name: "system_type_id",
                table: "servers",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.InsertData(
                table: "identities",
                columns: new[] { "id", "date_created", "password", "title", "user_id", "username" },
                values: new object[] { 2L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "123", "Test1", 1L, "root" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "icon_path", "name" },
                values: new object[] { null, "Default" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "icon_path", "name" },
                values: new object[] { "/SystemTypes/windows.svg", "Windows" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "icon_path", "name" },
                values: new object[] { "/SystemTypes/arch-linux.svg", "ArchLinux" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "icon_path", "name" },
                values: new object[] { "/SystemTypes/opensuse.svg", "OpenSuse" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "icon_path", "name" },
                values: new object[] { "/SystemTypes/fedora.svg", "Fedora" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "icon_path", "name" },
                values: new object[] { "/SystemTypes/centos.svg", "CentOS" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "icon_path", "name" },
                values: new object[] { "/SystemTypes/debian.svg", "Debian" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "icon_path", "name" },
                values: new object[] { "/SystemTypes/macos.svg", "MacOS" });

            migrationBuilder.InsertData(
                table: "system_types",
                columns: new[] { "id", "icon_path", "name" },
                values: new object[] { 9L, "/SystemTypes/ubuntu.svg", "Ubuntu" });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "user_id", "username" },
                values: new object[] { 2L, 2L, "PowerBlaze" });

            migrationBuilder.CreateIndex(
                name: "ix_servers_system_type_id",
                table: "servers",
                column: "system_type_id");

            migrationBuilder.AddForeignKey(
                name: "fk_servers_system_types_system_type_id",
                table: "servers",
                column: "system_type_id",
                principalTable: "system_types",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_system_types_system_type_id",
                table: "servers");

            migrationBuilder.DropIndex(
                name: "ix_servers_system_type_id",
                table: "servers");

            migrationBuilder.DeleteData(
                table: "identities",
                keyColumn: "id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 9L);

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: 2L);

            migrationBuilder.DropColumn(
                name: "system_type_id",
                table: "servers");

            migrationBuilder.RenameColumn(
                name: "icon_path",
                table: "system_types",
                newName: "photo");

            migrationBuilder.AddColumn<long>(
                name: "server_type_id",
                table: "servers",
                type: "bigint",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "name", "photo" },
                values: new object[] { "Windows", "/ServerTypes/windows.svg" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "name", "photo" },
                values: new object[] { "ArchLinux", "/ServerTypes/arch-linux.svg" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "name", "photo" },
                values: new object[] { "OpenSuse", "/ServerTypes/opensuse.svg" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "name", "photo" },
                values: new object[] { "Fedora", "/ServerTypes/fedora.svg" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "name", "photo" },
                values: new object[] { "CentOS", "/ServerTypes/centos.svg" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "name", "photo" },
                values: new object[] { "Debian", "/ServerTypes/debian.svg" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "name", "photo" },
                values: new object[] { "MacOS", "/ServerTypes/macos.svg" });

            migrationBuilder.UpdateData(
                table: "system_types",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "name", "photo" },
                values: new object[] { "Ubuntu", "/ServerTypes/ubuntu.svg" });

            migrationBuilder.CreateIndex(
                name: "ix_servers_server_type_id",
                table: "servers",
                column: "server_type_id");

            migrationBuilder.AddForeignKey(
                name: "fk_servers_system_types_server_type_id",
                table: "servers",
                column: "server_type_id",
                principalTable: "system_types",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
